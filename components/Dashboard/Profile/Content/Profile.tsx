"use client";

import { useState, useRef, useEffect } from "react";
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
  User,
  AtSign,
  FileText,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { getUserProfile, updateUserProfile } from "@/app/lib/actions/user";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

const Profile = () => {
  const session = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      platform: "GitHub",
      url: "",
      icon: <Github className="h-4 w-4" />,
    },
    {
      platform: "Twitter",
      url: "",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      platform: "LinkedIn",
      url: "",
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      platform: "Website",
      url: "",
      icon: <Globe className="h-4 w-4" />,
    },
  ]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  

  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index].url = value;
    setSocialLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Remove the icon property before submitting
      const serializableLinks = socialLinks.map(({ platform, url }) => ({
        platform,
        url,
      }));

      await updateUserProfile(session?.data?.user?.id || "", {
        socialLinks: serializableLinks, // Don't stringify here, let the server action handle it
      });

      toast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
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

  useEffect(() => {
    if (session?.data?.user) {
      const getUserData = async () => {
        const userData = await getUserProfile(
          session?.data?.user?.id as string
        );
        setDisplayName(userData.name || "");
        setBio(userData.bio || "");
        setAvatarSrc(userData.image || null);

        // Parse social links if available
        if (userData.socialLinks) {
          try {
            // Ensure we're working with a string first
            const linksStr =
              typeof userData.socialLinks === "string"
                ? userData.socialLinks
                : JSON.stringify(userData.socialLinks);

            // Parse the string into an array
            const parsedLinks = JSON.parse(linksStr);
            console.log("Parsed socialLinks:", parsedLinks);

            // Make sure we have an array
            if (Array.isArray(parsedLinks)) {
              // Map the parsed links to the format expected by your component
              const formattedLinks = parsedLinks.map((link) => ({
                platform: link.platform,
                url: link.url,
                icon:
                  link.platform === "GitHub" ? (
                    <Github className="h-4 w-4" />
                  ) : link.platform === "Twitter" ? (
                    <Twitter className="h-4 w-4" />
                  ) : link.platform === "LinkedIn" ? (
                    <Linkedin className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  ),
              }));

              setSocialLinks(formattedLinks);
            } else {
              console.error("socialLinks is not an array:", parsedLinks);
            }
          } catch (e) {
            console.error("Failed to parse socialLinks:", e);
          }
        }

        console.log("User Data loaded");
      };

      getUserData();
    }
  }, [session]);

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
                    <AvatarImage
                      src={avatarSrc}
                      alt="Profile"
                      style={{
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl">
                      {displayName?.substring(0, 2) || "AB"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="text-center sm:text-left sm:flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  An avatar is optional but strongly recommended.
                </p>
                <p className="text-sm text-muted-foreground">
                  It helps personalize your profile and makes your account more
                  recognizable.
                </p>

                <div className="mt-4 flex items-start gap-2">
                  <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={async (res) => {
                    // Do something with the response
                    toast("Upload Completed");
                    setAvatarSrc(res[0]?.url || "");
                    await updateUserProfile(session?.data?.user?.id || "", {
                    avatar: res[0]?.url || "",
                    });
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    toast.error(`ERROR! ${error.message}`);
                  }}
                 
                  />
                </div>
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
