type PageBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageBanner({ eyebrow, title, description }: PageBannerProps) {
  return (
    <header className="bg-[radial-gradient(circle_at_85%_20%,rgba(158,102,223,.5),transparent_34%),linear-gradient(120deg,#203c38,#361958_60%,#5b2f94)] py-[clamp(20px,2.5vw,28px)] text-white">
      <div className="mx-auto w-[min(1180px,calc(100%_-_48px))] max-[640px]:w-[calc(100%_-_32px)]">
        <span className="mb-1 inline-block text-[10px] font-black uppercase tracking-[.16em] text-[#d4f3a7]">{eyebrow}</span>
        <h1 className="mt-0 mb-1.5 max-w-[1000px] text-[clamp(30px,3.2vw,40px)] font-black leading-[1.08] tracking-[-.045em]">{title}</h1>
        <p className="m-0 max-w-[760px] text-[clamp(14px,1.3vw,16px)] leading-[1.45] text-[#eee7f7]">{description}</p>
      </div>
    </header>
  );
}
