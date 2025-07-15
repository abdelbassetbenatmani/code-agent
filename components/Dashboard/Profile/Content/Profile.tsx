"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Camera,
  User,
  AtSign,
  FileText,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { updateUserProfile } from "@/app/lib/actions/user";
import { toast } from "sonner";

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

const Profile = () => {
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    session?.data?.user?.image || null
  );
  const [displayName, setDisplayName] = useState(
    session?.data?.user?.name || ""
  );
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "GitHub", url: "", icon: <Github className="h-4 w-4" /> },
    { platform: "Twitter", url: "", icon: <Twitter className="h-4 w-4" /> },
    { platform: "LinkedIn", url: "", icon: <Linkedin className="h-4 w-4" /> },
    { platform: "Website", url: "", icon: <Globe className="h-4 w-4" /> },
  ]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index].url = value;
    setSocialLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Remove the icon property before stringifying
    const serializableLinks = socialLinks.map(({ platform, url }) => ({ platform, url }));
    await updateUserProfile(session?.data?.user?.id || "", {
      socialLinks: JSON.stringify(serializableLinks),
    });
    toast("Profile updated successfully!");
  };

  //   const handleAvatarChange = (newAvatar: string | null) => {
  //     setAvatarSrc(newAvatar);
  //   };

  const handleDisplayNameChange = async (newName: string) => {
    setDisplayName(newName);
    await updateUserProfile(session?.data?.user?.id || "", {
      displayName: newName,
    });

    toast("Display name updated successfully!");
  };

  const handleBioChange = async (newBio: string) => {
    setBio(newBio);
    await updateUserProfile(session?.data?.user?.id || "", {
      bio: newBio,
    });
    toast("Bio updated successfully!");
  };



  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Avatar
              </CardTitle>
              <CardDescription>
                This is your avatar. Click on the avatar to upload a custom one
                from your files.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div
                className="relative group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Avatar className="h-24 w-24 border-2 border-border">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                      {displayName?.substring(0, 2) || "AB"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center sm:text-left sm:flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  An avatar is optional but strongly recommended.
                </p>
                <p className="text-sm text-muted-foreground">
                  It helps personalize your profile and makes your account more
                  recognizable.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Display Name Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AtSign className="h-5 w-5" /> Display Name
              </CardTitle>
              <CardDescription>
                Please enter your full name, or a display name you are
                comfortable with.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={() => handleDisplayNameChange(displayName)}
                  placeholder="Enter your display name"
                  className="max-w-md"
                />
                <p className="text-sm text-muted-foreground">
                  Please use 32 characters at maximum.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Bio
              </CardTitle>
              <CardDescription>
                Write a short bio about yourself. This will be displayed on your
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                onBlur={() => handleBioChange(bio)}
                placeholder="Write a short bio about yourself..."
                className="min-h-[120px]"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Supports markdown formatting</span>
                <span>{bio.length}/300 characters</span>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add links to your social media profiles so others can find you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div
                    key={link.platform}
                    className="flex items-center space-x-3"
                  >
                    <Badge variant="outline" className="p-2">
                      {link.icon}
                    </Badge>
                    <div className="flex-1">
                      <Label
                        htmlFor={`social-${link.platform.toLowerCase()}`}
                        className="sr-only"
                      >
                        {link.platform}
                      </Label>
                      <Input
                        id={`social-${link.platform.toLowerCase()}`}
                        value={link.url}
                        onChange={(e) =>
                          handleSocialLinkChange(index, e.target.value)
                        }
                        placeholder={`Your ${link.platform} URL`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Profile;
