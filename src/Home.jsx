import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1>ホームページ</h1>
      <Link to="/login">アカウントをお持ちの方はこちらに</Link>
      <br />
      <Link to="/sign">アカウントを新規作成</Link>
      <br />
      <Link to="/GoogleLogin">Googleアカウントでログイン</Link>
    </div>
  );
};
