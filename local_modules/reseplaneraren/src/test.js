var Reseplaneraren = require('reseplaneraren');

var api = new Reseplaneraren.ArrivalBoardApi()

var id = 789; // {Number} stop id

var _date = new Date("2013-10-20"); // {Date} the date

var time = "time_example"; // {String} the time in format HH:MM

var direction = 789; // {Number} stop id in order to get only departures of vehicles with a specified direction

var opts = { 
  'useVas': "useVas_example", // {String} to exclude trips with Västtågen, set this parameter to 0.
  'useLDTrain': "useLDTrain_example", // {String} to exclude trips with long distance trains, set this parameter to 0.
  'useRegTrain': "useRegTrain_example", // {String} to exclude trips with regional trains, set this parameter to 0.
  'useBus': "useBus_example", // {String} to exclude trips with buses, set this parameter to 0.
  'useBoat': "useBoat_example", // {String} to exclude trips with boats, set this parameter to 0.
  'useTram': "useTram_example", // {String} to exclude trips with trams, set this parameter to 0.
  'excludeDR': "excludeDR_example", // {String} to exclude journeys which require tel. registration, set this parameter to 0.
  'timeSpan': 56, // {Number} to get the next departures in a specified timespan of up to 24 hours (unit: minutes). If this parameter is not set, the result will contain the next 20 departures.
  'maxDeparturesPerLine': 56, // {Number} if timeSpan is set you can further reduce the number of returned journeys by adding this parameter, which will cause only the given number of journeys for every combination of line and direction.
  'needJourneyDetail': "needJourneyDetail_example", // {String} if the reference URL for the journey detail service is not needed in the result, set this parameter to 0
  'format': "format_example", // {String} the required response format
  'jsonpCallback': "jsonpCallback_example" // {String} If JSONP response format is needed, you can append an additional parameter to specify the name of a callback function, and the JSON object will be wrapped by a function call with this name.
};

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
api.getArrivalBoard(id, _date, time, direction, opts, callback);