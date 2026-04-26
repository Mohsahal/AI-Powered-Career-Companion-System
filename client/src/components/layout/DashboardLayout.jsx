// import Header from "@/components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header /> */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 