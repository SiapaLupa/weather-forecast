type State = {
  [key: string]: {
    longitude: number;
    latitude: number;
  };
};

type Env = {
  API_KEY: string;
  API_URL: string;
};

enum UNIT {
  Fahrenheit = "imperial",
  Celcius = "metric",
  Kelvin = "standard",
}

type responseApi = {
  "cod": string;
  "message": number;
  "cnt": number;
  "list": Array<{
    "dt": number;
    "main": {
      "temp": number;
      "feels_like": number;
      "temp_min": number;
      "temp_max": number;
      "pressure": number;
      "sea_level": number;
      "grnd_level": number;
      "humidity": number;
      "temp_kf": number;
    };
    "weather": Array<{
      "id": number;
      "main": string;
      "description": string;
      "icon": string;
    }>;
    "clouds": {
      "all": number;
    };
    "wind": {
      "speed": number;
      "deg": number;
      "gust": number;
    };
    "visibility": number;
    "pop": number;
    "rain": {
      "3h": number;
    };
    "sys": {
      "pod": string;
    };
    "dt_txt": string;
  }>;
};

const STATE: State = {
  Jakarta: {
    longitude: 106.83941918790306,
    latitude: -6.208422090924453,
  },
};

const ENVIRONMENT_VARIABLE: Env = {
  API_KEY: "b1eee6bebf83532f24b7c835dbdc3918",
  API_URL: "https://api.openweathermap.org/data/2.5/forecast",
};

const table = document.querySelector("table") as HTMLTableElement;

function getFetchUrl(state: State[keyof State], unit = "standard"): string {
  const { longitude, latitude } = state;
  const resultUrl: string =
    `${this.API_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}`;
  return resultUrl.concat("&units=", unit);
}

fetch(getFetchUrl.call(ENVIRONMENT_VARIABLE, STATE.Jakarta, UNIT.Celcius))
  .then((response: Response) => {
    if (!response.ok) throw new Error("Failed to Fetch!");
    return response.json();
  })
  .then((responseJson: responseApi) => {
    let duplicateDate: string = "";

    console.table(responseJson.list);

    responseJson.list.forEach((list: responseApi["list"][0], index: number) => {
      const itemDate: string = list.dt_txt.split(" ")[0];

      if (itemDate === duplicateDate || index <= 4) return;

      duplicateDate = itemDate;

      const tr = document.createElement("tr") as HTMLTableRowElement;

      const dateString: string = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
      } as any).format(new Date(itemDate));

      const dateArray: Array<string> = dateString.split(" ");

      // Switch element in between index position 1 and 2
      dateArray.splice(1, 1, dateArray.splice(2, 1, dateArray[1]).toString());

      dateArray.forEach((date: string, index: number) => {
        const td = document.createElement("td") as HTMLTableCellElement;

        const text: Array<string> = [
          date.substring(0, 3) + ", ",
          date.slice(0, -1),
          date.substring(0, 3),
          date.concat(": ", String(list.main.temp.toFixed(2)), "&#8451"),
        ];

        td.innerHTML = text[index];
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  })
  .catch((error: Error) => {
    console.error(error.message);
  });
