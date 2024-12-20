import  { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Box from '@mui/material/Box';
import LineChartWeather from './components/LineChartWeather';

import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import NavbarComponent from "./components/NavbarComponent"
import './App.css';

interface Indicator {
    title: string;
    subtitle: string;
    value: string;
    emoji?: string;
}

interface Item {
    from: string;
    to: string;
    probability: string;
    humidity: string;
    clouds: string;
}

function App() {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    
    const [items, setItems] = useState<Item[]>([]);

    const API_KEY = 'b80ac3831581a26af061e88dac79b39a'; 

    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&appid=${API_KEY}`
            );
            if (!response.ok) throw new Error('Error fetching data');

            const data = await response.json();

            // Indicadores principales
            const indicatorsData: Indicator[] = [
                { title: 'CITY 🏙️', subtitle: 'City', value: data.city.name },
                { title: 'LATITUDE 🚩', subtitle: 'Degrees (°)', value: data.city.coord.lat.toString() },
                { title: 'LONGITUDE 🚩', subtitle: 'Degrees (°)', value: data.city.coord.lon.toString() },
                { title: 'TEMPERATURE 🥵', subtitle: '°C', value: `${(data.list[0].main.temp - 273.15).toFixed(1)}` },
            ];
            setIndicators(indicatorsData);

            // Tabla de pronóstico
            const itemsData = data.list.slice(0, 5).map((item: any) => ({
                from: item.dt_txt,
                to: item.dt_txt,
                probability: `${(item.pop * 100).toFixed(0)}%` || '0%',
                humidity: `${item.main.humidity}%`,
                clouds: `${item.clouds.all}%`,
            }));
            setItems(itemsData);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            alert('Hubo un problema al obtener los datos. Intenta nuevamente.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReload = () => {
        window.location.reload();
    };
//className={`app-container ${isDayMode ? 'day-mode' : 'night-mode'}`}
    return (
        <Container className="app-container"> 
            <NavbarComponent/>
            <Button className="update-button" onClick={handleReload}>
                🔄 Actualizar Dasboarh
            </Button>

            <Grid container spacing={4}>
                {indicators.map((indicator, idx) => (
                    <Grid key={idx} item xs={12} sm={6} md={4}>
                        <IndicatorWeather
                            title={indicator.title}
                            subtitle={indicator.subtitle}
                            value={indicator.value}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4} mt={4}>
                <Grid item xs={12} sm={12}>
                    <LineChartWeather data={items.map((item) => ({ name: item.from, temperature: parseFloat(item.probability) }))} />
                </Grid>
            </Grid>

            <Box mt={4}>
                <Typography variant="h5" align="center" gutterBottom>
                    Tabla de Pronóstico
                </Typography>
                <TableWeather itemsIn={items} />
            </Box>
            <Typography variant="caption" display="block" align="center" mt={4}>
                Copyright © Dashboard 2024
            </Typography>
        </Container>
    );
}

export default App;
