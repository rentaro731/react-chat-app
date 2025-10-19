import { Link } from "react-router-dom";
export const Home = () => {
  return (
    <div>
      <h1>Homeページです</h1>
      <Link to="/SignUp">アカウントを新規作成</Link>
      <br />
      <Link to="/Login">アカウントをお持ちの方はこちらに</Link>
    </div>
  );
};
