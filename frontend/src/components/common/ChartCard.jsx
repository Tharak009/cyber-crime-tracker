import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function BarChartCard({ title, labels, values }) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 h-72">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: title,
                data: values,
                backgroundColor: "#0e8f69"
              }
            ]
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
}

export function DoughnutChartCard({ title, labels, values }) {
  return (
    <div className="card p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 h-72">
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: ["#0e8f69", "#e85d04", "#0f172a", "#2563eb", "#8b5cf6", "#dc2626"]
              }
            ]
          }}
          options={{ maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
}
