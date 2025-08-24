import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { BoothAnalyticsData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface BoothAnalyticsChartsProps {
  data: BoothAnalyticsData;
  boothNumber: number;
}

const BoothAnalyticsCharts: React.FC<BoothAnalyticsChartsProps> = ({ data, boothNumber }) => {
  console.log('BoothAnalyticsCharts: Component rendered with props:', { boothNumber, dataKeys: Object.keys(data) });
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const createChartData = (data: any, label: string) => {
    console.log('BoothAnalyticsCharts: createChartData called with:', { label, dataKeys: data ? Object.keys(data) : null });
    if (!data) {
      console.log('BoothAnalyticsCharts: createChartData - no data provided, returning null');
      return null;
    }
    
    const labels = Object.keys(data);
    const values = Object.values(data);
    console.log('BoothAnalyticsCharts: createChartData - created chart data:', { labels, values });
    
    return {
      labels,
      datasets: [
        {
          label,
          data: values,
          backgroundColor: [
            '#3B82F6',
            '#EF4444',
            '#10B981',
            '#F59E0B',
            '#8B5CF6',
            '#EC4899',
            '#06B6D4',
            '#84CC16',
            '#F97316',
            '#6366F1',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const renderCasteChart = () => {
    console.log('BoothAnalyticsCharts: renderCasteChart called, data.caste:', data.caste);
    if (!data.caste) {
      console.log('BoothAnalyticsCharts: renderCasteChart - no caste data, returning null');
      return null;
    }
    
    const chartData = createChartData(data.caste, 'Caste Distribution');
    if (!chartData) {
      console.log('BoothAnalyticsCharts: renderCasteChart - no chart data created, returning null');
      return null;
    }

    console.log('BoothAnalyticsCharts: renderCasteChart - rendering Pie chart');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Caste Distribution</h3>
        <div className="h-64">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderAgeChart = () => {
    console.log('BoothAnalyticsCharts: renderAgeChart called, data.age:', data.age);
    if (!data.age) {
      console.log('BoothAnalyticsCharts: renderAgeChart - no age data, returning null');
      return null;
    }
    
    const chartData = createChartData(data.age, 'Age Distribution');
    if (!chartData) {
      console.log('BoothAnalyticsCharts: renderAgeChart - no chart data created, returning null');
      return null;
    }

    console.log('BoothAnalyticsCharts: renderAgeChart - rendering Bar chart');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderGenderChart = () => {
    console.log('BoothAnalyticsCharts: renderGenderChart called, data.gender:', data.gender);
    if (!data.gender) {
      console.log('BoothAnalyticsCharts: renderGenderChart - no gender data, returning null');
      return null;
    }
    
    const chartData = createChartData(data.gender, 'Gender Distribution');
    if (!chartData) {
      console.log('BoothAnalyticsCharts: renderGenderChart - no chart data created, returning null');
      return null;
    }

    console.log('BoothAnalyticsCharts: renderGenderChart - rendering Doughnut chart');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <div className="h-64">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderEducationChart = () => {
    console.log('BoothAnalyticsCharts: renderEducationChart called, data.education:', data.education);
    if (!data.education) {
      console.log('BoothAnalyticsCharts: renderEducationChart - no education data, returning null');
      return null;
    }
    
    const chartData = createChartData(data.education, 'Education Level');
    if (!chartData) {
      console.log('BoothAnalyticsCharts: renderEducationChart - no chart data created, returning null');
      return null;
    }

    console.log('BoothAnalyticsCharts: renderEducationChart - rendering Bar chart');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Education Level</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderOccupationChart = () => {
    console.log('BoothAnalyticsCharts: renderOccupationChart called, data.occupation:', data.occupation);
    if (!data.occupation) {
      console.log('BoothAnalyticsCharts: renderOccupationChart - no occupation data, returning null');
      return null;
    }
    
    const chartData = createChartData(data.occupation, 'Occupation');
    if (!chartData) {
      console.log('BoothAnalyticsCharts: renderOccupationChart - no chart data created, returning null');
      return null;
    }

    console.log('BoothAnalyticsCharts: renderOccupationChart - rendering Bar chart');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Occupation</h3>
        <div className="h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  const renderRawData = () => {
    console.log('BoothAnalyticsCharts: renderRawData called');
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  console.log('BoothAnalyticsCharts: Rendering component with all charts');
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booth {boothNumber} Analytics
        </h2>
        <p className="text-gray-600">
          Visual representation of booth-level voter data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCasteChart()}
        {renderAgeChart()}
        {renderGenderChart()}
        {renderEducationChart()}
        {renderOccupationChart()}
      </div>

      {renderRawData()}
    </div>
  );
};

export default BoothAnalyticsCharts;
