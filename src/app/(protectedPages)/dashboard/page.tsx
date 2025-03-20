import DashboardComponent from "@/src/components/dashboard";

const DashboardPage = () => {
  return (
    <>
      <div className="min-h-screen h-full bg-white flex  items-center justify-center pt-10 pb-14 text-black">
        <div className="w-full max-w-5xl px-2">
          <DashboardComponent />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
