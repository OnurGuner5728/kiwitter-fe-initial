import queryString from "query-string";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "./services/api";
import { UserContext } from "./contexts/UserContext";
import { NotificationContext } from "./contexts/NotificationContext";
import { Link } from "react-router-dom";

export default function Login() {
  const { search } = useLocation();
  const history = useHistory();
  const values = queryString.parse(search);
  const { setToken, setUser } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  async function handleLogin(data) {
    try {
      const response = await authService.login(data);
      const { token, user } = response.data;
      
      // Token ve kullanıcı bilgilerini saklayalım
      setToken(token);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      
      showNotification("Başarıyla giriş yapıldı", "success");
      history.push("/");
    } catch (error) {
      console.error("Giriş hatası:", error);
      showNotification(
        error.response?.data?.message || "Giriş yapılırken bir hata oluştu",
        "error"
      );
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl text-center font-semibold tracking-tighter text-lime-700">
        Hoş Geldin!
      </h1>
      <form onSubmit={handleSubmit(handleLogin)}>
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
            <label htmlFor="password">Şifre</label>
            <span className="text-sm font-medium text-red-600">
              {errors.password && errors.password.message.toString()}
            </span>
          </div>
          <input
            type="password"
            className="w-full h-10 px-2 border rounded-md border-gray-300"
            {...register("password", { required: "Bu alan zorunlu" })}
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            className="h-12 text-center block w-full rounded-lg bg-lime-700 text-white font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "GİRİŞ YAPILIYOR..." : "GİRİŞ"}
          </button>
        </div>

        <div className="pt-4 text-center">
          <p className="text-gray-600">
            Hesabınız yok mu?{" "}
            <Link to="/signup" className="text-lime-700 font-semibold">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
