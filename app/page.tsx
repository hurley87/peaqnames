export default function Home() {
  return (
    <div className="">
      <div className="border h-[600px] w-[600px] bg-white flex relative p-6 mx-auto">
        <div className="flex flex-col h-full w-full justify-center">
          <div className="flex flex-col h-[300px] w-full justify-between p-6 bg-[#6565FF] rounded-3xl shadow-xl">
            <img src="/peaq.jpg" alt="Peaqnames" className="w-[70px] h-[70px] border-2 rounded-full" />
            <p className="text-white text-5xl truncate">david.peaq</p>
          </div>
        </div>
      </div>
    </div>
  );
}
