"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import {
  RegisterBody,
  type RegisterBodyType,
} from "../../schemaValidations/auth.schema";
import UserService from "../../services/UserService";
import CustomLoadingAnimation from "../common/CustomLoadingAnimation";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterBodyType) => {
      return UserService.register({
        email: values.email,
        password: values.password,
        username: values.username,
      });
    },
    onMutate: () => {
      if (loading) return;
      setLoading(true);
    },
    onSuccess: () => {
      toast.success("Đăng ký thành công", {
        description: "Bạn đã đăng ký tài khoản thành công",
        duration: 3000,
      });
      navigate("/login");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error("Lỗi", {
        description: error.message || "Lỗi không xác định",
        duration: 3000,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  async function onSubmit(values: RegisterBodyType) {
    registerMutation.mutate(values);
  }
  return (
    <Fragment>
      <CustomLoadingAnimation isLoading={loading} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-[600px] flex-shrink-0 space-y-2"
          noValidate
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên người dùng</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tên người dùng"
                    type="text"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Mật khẩu"
                    type="password"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhập lại mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    className={cn(
                      "!h-auto !rounded-none border border-solid border-[#333] px-3 py-2 pr-[2.625rem] text-base font-normal focus:outline-none",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className={cn(
              "!mt-4 h-auto w-full rounded-none border-[2px] border-solid border-[#1250DC] bg-[#1250DC] py-3 text-base font-bold text-white transition-all duration-200",
              "hover:cursor-pointer hover:bg-[#1250DC]/[0.9]",
            )}
          >
            Đăng ký
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default RegisterForm;
