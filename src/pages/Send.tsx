import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send as SendIcon, Image as ImageIcon, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api, Profile } from "@/lib/api";

const Send = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await api.getProfiles();
      setProfiles(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить профили. Проверьте подключение к серверу.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!selectedProfile) {
      toast({
        title: "Ошибка",
        description: "Выберите профиль",
        variant: "destructive",
      });
      return;
    }

    if (!phone) {
      toast({
        title: "Ошибка",
        description: "Введите номер телефона",
        variant: "destructive",
      });
      return;
    }

    if (!message && !image && !audio) {
      toast({
        title: "Ошибка",
        description: "Введите сообщение или прикрепите файл",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const result = await api.sendMessage(selectedProfile, phone, message, image, audio);

      if (result.success) {
        toast({
          title: "Сообщение отправлено!",
          description: `Сообщение успешно отправлено на номер ${phone}`,
        });
        setPhone("");
        setMessage("");
        setImage(null);
        setAudio(null);
      } else {
        toast({
          title: "Ошибка отправки",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка подключения",
        description: "Не удалось отправить сообщение. Проверьте подключение к серверу.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SendIcon className="h-5 w-5 text-primary" />
          Отправить сообщение
        </CardTitle>
        <CardDescription>Отправьте сообщение одному получателю</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile">Профиль</Label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger id="profile" className="bg-secondary border-border">
              <SelectValue placeholder="Выберите профиль" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.name} value={profile.name}>
                  {profile.name} ({profile.phone})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Номер телефона</Label>
          <Input
            id="phone"
            placeholder="+79991234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Сообщение</Label>
          <Textarea
            id="message"
            placeholder="Введите ваше сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] bg-secondary border-border resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {image ? image.name : 'Прикрепить фото'}
            </Button>
            <input
              id="image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('audio-input')?.click()}
            >
              <Mic className="mr-2 h-4 w-4" />
              {audio ? audio.name : 'Прикрепить аудио'}
            </Button>
            <input
              id="audio-input"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudio(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleSend}
          disabled={!selectedProfile || !phone || isSending}
        >
          <SendIcon className="mr-2 h-4 w-4" />
          {isSending ? "Отправка..." : "Отправить сообщение"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Send;
