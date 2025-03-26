import { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useForm } from "react-hook-form";
import { authService } from "./services/api";
import { NotificationContext } from "./contexts/NotificationContext";

export default function Signup() {
  const history = useHistory();
  const { showNotification } = useContext(NotificationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  async function handleSignup(data) {
    try {
      await authService.register(data);
      showNotification("Kayıt işlemi başarılı! Giriş yapabilirsiniz.", "success");
      history.push("/login");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification(
        error.response?.data?.message || "Kayıt sırasında bir hata oluştu",
        "error"
      );
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl text-center font-semibold tracking-tighter text-lime-700">
        Hoş Geldin!
      </h1>
      <form onSubmit={handleSubmit(handleSignup)}>
        <div className="pt-4">
          <div className="flex justify-between gap-2 items-baseline pb-1">
            <label htmlFor="name">İsim Soyisim</label>
            <span className="text-sm font-medium text-red-600">
              {errors.name && errors.name.message.toString()}
            </span>
          </div>
          <input
            type="text"
            className="w-full h-10 px-2 border rounded-md border-gray-300"
            {...register("name", { required: "Bu alan zorunlu" })}
          />
        </div>

        <div className="pt-4">
          <div className="flex justify-between gap-2 items-baseline pb-1">
            <label htmlFor="nickname">Kullanıcı adı</label>
            <span className="text-sm font-medium text-red-600">
              {errors.nickname && errors.nickname.message.toString()}
            </span>
          </div>
          <input
            type="text"
            className="w-full h-10 px-2 border rounded-md border-gray-300"
            {...register("nickname", { required: "Bu alan zorunlu" })}
          />
        </div>

        <div className="pt-4">
          <div className="flex justify-between gap-2 items-baseline pb-1">
            <label htmlFor="email">Email</label>
            <span className="text-sm font-medium text-red-600">
              {errors.email && errors.email.message.toString()}
            </span>
          </div>
          <input
            type="email"
            className="w-full h-10 px-2 border rounded-md border-gray-300"
            {...register("email", {
              required: "Bu alan zorunlu",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Geçerli bir email adresi girin",
              },
            })}
          />
        </div>

        <div className="pt-4">
          <div className="flex justify-between gap-2 items-baseline pb-1">
            <label htmlFor="password">Şifre</label>
            <span className="text-sm font-medium text-red-600">
              {errors.password && errors.password.message.toString()}
            </span>
          </div>
          <input
            type="password"
            className="w-full h-10 px-2 border rounded-md border-gray-300"
            {...register("password", { 
              required: "Bu alan zorunlu",
              minLength: {
                value: 6,
                message: "Şifre en az 6 karakter olmalıdır"
              }
            })}
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="h-12 text-center block w-full rounded-lg bg-lime-700 text-white font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "KAYIT YAPILIYOR..." : "KAYIT OL"}
          </button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link to="/login" className="text-lime-700 font-semibold">
              Giriş Yap
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
