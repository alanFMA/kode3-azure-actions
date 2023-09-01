import React from 'react';

interface ApiData {
  component_id: string;
  description: string;
  owner: string;
  programming: string;
  multiselect: string | string[];
}

interface HomePageProps {
  apiData: ApiData;
}

const HomePage: React.FC<HomePageProps> = ({ apiData }) => {
  return (
      <ul>
        {Object.entries(apiData).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
          </li>
        ))}
      </ul>
  );
};

export default HomePage;
