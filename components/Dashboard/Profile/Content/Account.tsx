"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Bell,
  CreditCard,
  Mail,
  Trash2,
  Info,
  AlertCircle,
  Calendar,
  Receipt,
  Github,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { deleteUserProfile, getUserProfile, updateUserProfile } from "@/app/lib/actions/user";
import { toast } from "sonner";

const Account = () => {
  const session = useSession();
  const [primaryEmail, setPrimaryEmail] = useState("");

  const [secondaryEmail, setSecondaryEmail] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState("");

  // Notification preferences
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    accountActivity: true,
    billingAlerts: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock billing data
  const currentPlan = "Pro";
  const nextBillingDate = "August 15, 2025";
  const billingHistory = [
    { id: "INV-001", date: "July 15, 2025", amount: "$12.00", status: "Paid" },
    { id: "INV-002", date: "June 15, 2025", amount: "$12.00", status: "Paid" },
    { id: "INV-003", date: "May 15, 2025", amount: "$12.00", status: "Paid" },
  ];

  const handleAddSecondaryEmail = async () => {
    if (secondaryEmail) {
      await updateUserProfile(session?.data?.user?.id || "", {
        secondaryEmail: secondaryEmail,
      });
      setSecondaryEmail("");
      toast("Secondary email added successfully");
    }
  };

  const handleDeleteAccount = async() => {
    if (confirmDeleteInput === "delete my account") {
      const deletedUser = await deleteUserProfile(session?.data?.user?.id as string);
      toast("Account deleted successfully");
      setIsDeleteDialogOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      deletedUser === true && (window.location.href = "/"); // Redirect to home or login page
    } else {
      toast("Please type 'delete my account' to confirm deletion");
    }
  };

  useEffect(() => {
    if (session?.data?.user) {
      const getUserData = async () => {
        const userData = await getUserProfile(
          session?.data?.user?.id as string
        );
        setPrimaryEmail(userData.email);
        setSecondaryEmail(userData.secondaryEmail || "");
      };

      getUserData();
    }
  }, [session?.data?.user]);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-6">
        {/* Email & Contact Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Email & Contact Info
            </CardTitle>
            <CardDescription>
              Manage your email addresses for account access and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary Email (GitHub-provided) */}
            <div className="space-y-2">
              <Label htmlFor="primary-email">Primary Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-email"
                  value={primaryEmail}
                  readOnly
                  className="max-w-md bg-muted/50"
                />
                <Badge variant="outline" className="ml-2">
                  <div className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    <span>GitHub Account</span>
                  </div>
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                This email is associated with your GitHub account and cannot be
                changed here.
              </p>
            </div>

            {/* Secondary Email */}
            <div className="space-y-2 pt-4">
              <Label htmlFor="secondary-email">
                Secondary Email (Optional)
              </Label>
              <div className="flex gap-2 max-w-md">
                <Input
                  id="secondary-email"
                  type="email"
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  placeholder="Enter a backup email address"
                />
                <Button onClick={handleAddSecondaryEmail} type="button">
                  Add
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Used for billing or important account notifications only.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Billing & Subscription Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription, payment methods, and billing history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="subscription">
              <TabsList className="mb-4">
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="payment">Payment Method</TabsTrigger>
                <TabsTrigger value="history">Billing History</TabsTrigger>
              </TabsList>

              <TabsContent value="subscription" className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Current Plan</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-blue-600">{currentPlan}</Badge>
                      <span className="text-sm text-muted-foreground">
                        $12/month
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Next billing: {nextBillingDate}</span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Downgrade
                    </Button>
                    <Button size="sm">Upgrade</Button>
                  </div>
                </div>

                <Alert variant="default" className="bg-muted/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Plan Features</AlertTitle>
                  <AlertDescription className="text-sm">
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Unlimited projects</li>
                      <li>Priority support</li>
                      <li>Advanced analytics</li>
                      <li>Team collaboration</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="payment">
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-md">
                    <div className="h-8 w-12 mr-4 flex items-center justify-center bg-muted rounded">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Visa ending in 4242</div>
                      <div className="text-sm text-muted-foreground">
                        Expires 12/2025
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>

                  <Button variant="outline" className="mt-2" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add New Payment Method
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billingHistory.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Receipt className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notification Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notification Preferences
            </CardTitle>
            <CardDescription>
              Control which emails you receive from us.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="product-updates">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about new features and improvements.
                  </p>
                </div>
                <Switch
                  id="product-updates"
                  checked={notifications.productUpdates}
                  onCheckedChange={() => toggleNotification("productUpdates")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="account-activity">Account Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your account security and sign-ins.
                  </p>
                </div>
                <Switch
                  id="account-activity"
                  checked={notifications.accountActivity}
                  onCheckedChange={() => toggleNotification("accountActivity")}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="billing-alerts">Billing Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your subscription, invoices and payment
                    issues.
                  </p>
                </div>
                <Switch
                  id="billing-alerts"
                  checked={notifications.billingAlerts}
                  onCheckedChange={() => toggleNotification("billingAlerts")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" /> Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action cannot be undone. All your data will be permanently
                removed.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Account Confirmation
                  </DialogTitle>
                  <DialogDescription>
                    This will permanently delete your data. Since you use GitHub
                    login, you&apos;ll no longer be able to access your account.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <p className="text-sm">
                    To confirm, type{" "}
                    <span className="font-semibold">delete my account</span>{" "}
                    below:
                  </p>
                  <Input
                    value={confirmDeleteInput}
                    onChange={(e) => setConfirmDeleteInput(e.target.value)}
                    placeholder="delete my account"
                    className="bg-muted/50"
                  />
                </div>

                <DialogFooter className="gap-2 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Account;
