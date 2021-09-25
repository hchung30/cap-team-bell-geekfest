let setup = document.getElementById('setup');
let lat, lng;
let google = 'AIzaSyAG-ZiZb-KM8YUX8Yu5Bcu3SBIIm15m394';
let aqicn = 'ba06fa74313e00ce71d3e014553f3bc35f65b911';
let currentAqi = 70;
let currentAqiDesc = { desc: 'Normal', color: '#afb300' };
let currentAqiCity = 'Moderate';
let isAqiNum = true;
let input = document.getElementById('keyword');
(() => {
  setDefault();
  callAPI(input, google, aqicn);
})();

function getLevelForAqi(aqi) {
  if (aqi <= 50) return { desc: 'Good', color: '#009966' };
  else if (aqi >= 51 && aqi <= 100)
    return { desc: 'Moderate', color: '#ffde33' };
  else if (aqi >= 101 && aqi <= 150)
    return { desc: 'Unhealthy for Sensitive Groups', color: '#ff9933' };
  else if (aqi >= 151 && aqi <= 200)
    return { desc: 'Unhealthy', color: '#cc0033' };
  else if (aqi >= 201 && aqi <= 300)
    return { desc: 'Very Unhealthy', color: '#660099' };
  else return { desc: 'Hazardous', color: '#7e0023' };
}

function callAPI(input, google, aqicn) {
  input.addEventListener('change', (event) => {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${google}&address=${input.value}`
    )
      .then((res) => {
        return res.json();
      })
      .then((json) => { 
        let geodata = json.results[0];
        console.log(geodata);

        lat = geodata.geometry.location.lat;
        lng = geodata.geometry.location.lng;
        return fetch(
          `https://api.waqi.info/feed/geo:${geodata.geometry.location.lat};${geodata.geometry.location.lng}/?token=${aqicn}`
        );
      })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        let descdata = getLevelForAqi(json.data.aqi);
        currentAqi = json.data.aqi;
        currentAqiDesc = descdata;
        currentAqiCity = json.data.city.name;
        console.log('### waqi', json);
        updateData(currentAqiCity, currentAqi, currentAqiDesc);

        setInterval(() => {
          fetch(
            `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${aqicn}`
          )
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              let descdata = getLevelForAqi(json.data.aqi);
              console.log('### descdata ', descdata);
              currentAqi = json.data.aqi;
              currentAqiDesc = descdata;
              console.log('updated!');
            });
        }, 10000);
      });
  });
}

function setDefault() {
  console.log('SET DEFAULT', isAqiNum);
  if (isAqiNum) {
    document.getElementById('city').innerHTML = currentAqiCity;
    document.querySelector('#quality').style.backgroundColor =
      currentAqiDesc.color;
    document.querySelector('#quality h2').innerHTML = currentAqiDesc.desc;
    document.getElementById('aqi').innerHTML = currentAqi;
  }
}
// setInterval(() => {
//   document.getElementById('body').style.backgroundColor =
//     currentAqiDesc.color;
//   setDefault();
//   // isAqiNum = !isAqiNum;
// }, 2000);

function updateData(currentAqiCity, currentAqi, currentAqiDesc) {
  document.getElementById('city').innerHTML = currentAqiCity;
  document.querySelector('#quality').style.backgroundColor =
    currentAqiDesc.color;
  document.querySelector('#quality h2').innerHTML = currentAqiDesc.desc;

  document.getElementById('aqi').innerHTML = currentAqi;
}