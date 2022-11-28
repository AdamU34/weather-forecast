import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Divider from "@mui/material/Divider";
import { WiSunrise, WiSunset } from "react-icons/wi";

import "./App.css";

type DataType = {
  name: string;
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
  };
};

const apiKey: string = process.env.REACT_APP_API_KEY as string;
const baseUrl = "https://api.openweathermap.org/data/2.5";
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export default function App() {
  const [city, setCity] = useState<string>("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<DataType>();

  useEffect(() => {
    // London weather is displayed by default
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${baseUrl}/weather?q=london&units=metric&appid=${apiKey}`
        );
        const json = await res.json();
        if (json?.cod === "404") {
          setError(json?.message);
          setIsLoading(false);
        } else {
          setData(json);
          setCity("");
          setError("");
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: any): void => {
    if (e.target.value === "") {
      setError("");
    }
    setCity(e.target.value);
  };

  const getData = async () => {
    setIsLoading(true);

    const town = city?.toLowerCase();
    const url = `${baseUrl}/weather?q=${town}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json?.cod === "404") {
        setError(json?.message);
        setIsLoading(false);
      } else {
        setData(json);
        setCity("");
        setError("");
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const formatDate = (timestamp: number) => {
    const unixTimestamp = timestamp;
    const date = new Date(unixTimestamp * 1000);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
  };

  const capitalizeFirstLetter = (str: string) => {
    return `"${str.charAt(0).toUpperCase()}${str.slice(1)}"`;
  };

  return (
    <div className="App">
      <h1 style={{ marginBottom: "40px" }}>Weather Forecast</h1>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          value={city}
          onChange={handleChange}
          size="small"
          label="City"
          variant="outlined"
          error={Boolean(error) && Boolean(city)}
          helperText={error && city ? error : ""}
        />
        <Button onClick={() => getData()} variant="contained" size="medium">
          Search
        </Button>
      </Stack>

      {!error && isLoading && <div data-testid="fetch-loading">Loading...</div>}

      {!error && !isLoading && (
        <Card
          sx={{
            margin: "30px",
            width: 345,
            "@media (min-width: 600px)": {
              width: 500,
            },
          }}
          role="weather-card"
        >
          <CardActionArea>
            <CardMedia
              component="img"
              height="180"
              image={
                data?.name &&
                `http://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@4x.png`
              }
              alt={data?.name && data?.weather?.[0]?.main}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {data?.name},{" "}
                {data?.sys?.country && regionNames.of(data?.sys?.country)}
              </Typography>
              <Typography gutterBottom variant="h3" component="div">
                {data?.name && Math.round(data?.main?.temp)}{" "}
                <span>&#8451;</span>
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                {data?.name && data?.weather?.[0]?.main}
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                {data?.name &&
                  capitalizeFirstLetter(data?.weather?.[0]?.description)}
              </Typography>
              <Divider
                sx={{
                  margin: "20px 0",
                }}
              />
              <Typography
                variant="body1"
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WiSunrise size={30} />
                <span>{data?.name && formatDate(data?.sys?.sunrise)}</span>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <WiSunset size={30} />
                <span>{data?.name && formatDate(data?.sys?.sunset)}</span>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
    </div>
  );
}
