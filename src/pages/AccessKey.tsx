import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface AccessKeyProps {
  onAccessGranted: () => void;
}

const AccessKey = ({ onAccessGranted }: AccessKeyProps) => {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите ключ доступа",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.validateKey(key);
      
      if (result.valid) {
        // Save activation in localStorage
        localStorage.setItem("app_activated", "true");
        toast({
          title: "Успешно!",
          description: result.message,
        });
        onAccessGranted();
      } else {
        toast({
          title: "Ошибка",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось проверить ключ. Проверьте подключение к серверу.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <Card className="w-full max-w-md border-2 border-purple-500/30 shadow-2xl bg-black/40 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Активация приложения</CardTitle>
          <CardDescription className="text-gray-300">
            Введите ключ доступа для начала работы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type="text"
                  placeholder="Введите ключ доступа"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  className="pl-10 bg-black/30 border-purple-500/50 text-white placeholder:text-gray-400 focus:border-purple-500"
                  disabled={loading}
                  maxLength={16}
                />
              </div>
              <p className="text-xs text-gray-400">
                Ключ состоит из 16 символов (буквы и цифры)
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Проверка..." : "Активировать"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-xs text-gray-300 text-center">
              Ключ доступа предоставляется администратором.<br />
              После активации доступ предоставляется бесконечно.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessKey;
