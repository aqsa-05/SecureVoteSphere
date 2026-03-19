import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { voterLoginSchema, adminLoginSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import RoleTabs from "@/components/role-tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

// Combine the schemas with client-side validation
const voterSchema = voterLoginSchema.extend({
  rememberDevice: z.boolean().optional(),
});

const adminSchema = adminLoginSchema.extend({});

type VoterFormValues = z.infer<typeof voterSchema>;
type AdminFormValues = z.infer<typeof adminSchema>;

export default function Login() {
  const [activeTab, setActiveTab] = useState<"voter" | "admin">("voter");
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  // Voter form
  const voterForm = useForm<VoterFormValues>({
    resolver: zodResolver(voterSchema),
    defaultValues: {
      voterId: "",
      password: "",
      rememberDevice: false,
    },
  });

  // Admin form
  const adminForm = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: "admin",
      password: "admin123",
      securityToken: "123456",
    },
  });

  const onVoterSubmit = async (values: VoterFormValues) => {
    try {
      await login({
        type: "voter",
        credentials: {
          voterId: values.voterId,
          password: values.password,
        },
      });
      navigate("/verification");
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Invalid voter credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onAdminSubmit = async (values: AdminFormValues) => {
    try {
      console.log("Admin login attempt with values:", values);
      
      const user = await login({
        type: "admin",
        credentials: {
          username: values.username,
          password: values.password,
          securityToken: values.securityToken,
        },
      });
      
      console.log("Admin login successful, user:", user);
      navigate("/admin");
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Authentication Failed",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary">Secure Voting Portal</h2>
            <p className="mt-2 text-sm text-gray-600">
              Zero Trust Authentication Required
            </p>
          </div>

          <RoleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "voter" ? (
            <Form {...voterForm}>
              <form onSubmit={voterForm.handleSubmit(onVoterSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={voterForm.control}
                    name="voterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voter ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your voter ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={voterForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <FormField
                    control={voterForm.control}
                    name="rememberDevice"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          Trusted device
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary-light">
                      Need help?
                    </a>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  Continue to Verification
                </Button>

                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                    Zero Trust Security Enabled
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={adminForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter admin ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adminForm.control}
                    name="securityToken"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Token</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter security token" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" variant="secondary" className="w-full">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  </span>
                  Authenticate
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
