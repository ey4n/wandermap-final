const RouteSteps = ({ route }) => {
  console.log("route in RouteSteps: ", route)
  return (
    <div>
      {route["routes"][0].legs.map((leg, legIndex) => (
        <div className="m-4 p-4 border-2 border-emerald-400">
          {/* Leg: {legIndex + 1} */}
          {leg.steps.map((step, index) => (
            <div className="m-4 p-4 border-2 border-black" key={index}>
              <div>
                <strong>Step {index + 1}:</strong>
              </div>
              <div>Distance: {step.distanceMeters} meters</div>
              <div>Duration: {step.staticDuration}</div>
              {step.navigationInstruction && (
                <div>Instructions: {step.navigationInstruction.instructions}</div>
              )}
              {/* {step.polyline && (
                <div className="text-wrap break-words">
                  Polyline: {step.polyline.encodedPolyline}
                </div>
              )} */}
              {step.travelMode && <div>Travel Mode: {step.travelMode}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RouteSteps;
