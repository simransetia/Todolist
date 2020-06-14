// jshint eversion:6


module.exports.getDay=getDay;


exports.getDate = function(){
const today = new Date();

const options={
weekday: "long",
day:"numeric",
month:"long"
};
  const day = today.toLocaleDateString("en-us",options);

  return day;
}

function getDay(){
const today = new Date();

const options={
weekday: "long",

};
  const day = today.toLocaleDateString("en-us",options);

  return day;
}
