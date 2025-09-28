import { UserAuth } from "./UserAuth";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full p-4 z-20">
      <div className="container mx-auto flex justify-end">
        <UserAuth />
      </div>
    </header>
  );
};

export default Header;