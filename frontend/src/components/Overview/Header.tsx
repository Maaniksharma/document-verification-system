import Logo from "../ui/Logo";
import ProfileIcon from "../ui/ProfileIcon";

const Header = () => {
  return (
    <header className="w-full flex justify-between px-[40px] py-[16px] items-center">
      <Logo />
      <div className="flex items-center gap-[24px]">
        <img src="/svg/bell.svg" alt="" className="w-[24px] h-[24px]" />
        <div className="py-[6px] px-[10px] flex gap-[6px] items-center border-1 border-gray-200 rounded-3xl">
          <ProfileIcon />
          <div className="text-xs font-light">Maanik</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
