import React from 'react';
import axios from 'axios';

interface ApiData {
  component_id: string;
  description: string;
  owner: string;
  programming: string;
  multiselect: string | string[];
}

interface HomeProps {
  apiData: ApiData;
}

const Home: React.FC<HomeProps> = ({ apiData }) => {
  const jsonData = JSON.stringify(apiData, null, 2);

  return (
    <div>
      <pre>{jsonData}</pre>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const host = '${{ parameters.url }}'
    const response = await axios.get<ApiData>(`http://localhost:${host}/`);
    const apiData = response.data;

    return {
      props: {
        apiData,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        apiData: {
          component_id: '',
          description: '',
          owner: '',
          programming: '',
          multiselect: '',
        },
      },
    };
  }
}

export default Home;
