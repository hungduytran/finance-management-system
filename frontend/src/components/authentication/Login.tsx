import { Fragment } from "react";
import { cn } from "../../lib/utils";
import LoginForm from "./LoginForm";
import googleLogo from "/src/assets/google-icon.svg";

const Login = () => {
  return (
    <Fragment>
      <div
        className={cn(
          "relative flex h-screen w-screen items-center justify-center bg-white bg-[url('/src/assets/auth_bg.jpg')] bg-cover bg-center bg-no-repeat py-[3.5rem]",
        )}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-[1] rounded-md border border-[#333] bg-white px-10 py-8 shadow-2xl">
          <div className="flex w-[97.5%] flex-col md:w-[25rem]">
            <h1 className="mb-4 text-center text-[1.5625rem] font-semibold uppercase">
              Đăng nhập tài khoản
            </h1>
            <LoginForm />
            <div className="mx-auto mt-3 space-x-1">
              <span>Bạn chưa có tài khoản?</span>
              <a href={"/register"} className="text-center font-bold">
                Đăng ký
              </a>
            </div>
            <div className="mt-6">
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="h-px w-[5rem] bg-[#333]"></div>
                <div className="text-center text-[0.875rem]">
                  Hoặc đăng nhập với
                </div>
                <div className="h-px w-[5rem] bg-[#333]"></div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  className={cn(
                    "flex h-10 flex-row items-center gap-[0.625rem] rounded-[6.25rem] border border-solid border-[#747775] px-3 py-[0.625rem] shadow-lg transition-all duration-300",
                    "hover:cursor-pointer hover:border-[#5478B1] active:border-none active:bg-[#EEEEEE]",
                  )}
                >
                  <img src={googleLogo} alt="" className="size-[1.125rem]" />
                  <span className="text-[0.875rem] leading-normal font-medium text-[#1F1F1F]">
                    Đăng nhập với Google
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
