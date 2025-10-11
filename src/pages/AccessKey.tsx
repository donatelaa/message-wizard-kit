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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <Card className="w-full max-w-md border border-gray-800 shadow-2xl bg-[#121212]">
        <CardHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white mb-2">Активация приложения</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Введите ключ доступа для начала работы
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-purple-400" />
                <Input
                  type="text"
                  placeholder="Введите ключ доступа"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  className="pl-10 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 h-12"
                  disabled={loading}
                  maxLength={16}
                />
              </div>
              <p className="text-xs text-gray-500">
                Ключ состоит из 16 больших букв
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold h-12 text-base"
              disabled={loading}
            >
              {loading ? "Проверка..." : "Активировать"}
            </Button>
          </form>
          
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center leading-relaxed">
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
