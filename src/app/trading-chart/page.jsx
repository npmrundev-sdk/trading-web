import DemoTradingBox from "@/components/modals/DemoTradingBox";
import TradingChart from "@/components/modals/TradingChart";

export default function Page() {
  return (
    <div className="p-2 md:p-6">
      <DemoTradingBox />
      <TradingChart />
    </div>
  );
}