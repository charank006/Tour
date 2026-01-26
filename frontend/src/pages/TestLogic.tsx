import { planningLogic } from "@/lib/planningLogic";
import { useEffect, useState } from "react";

const TestPage = () => {
    const [hotItinerary, setHotItinerary] = useState<any>(null);
    const [rainyItinerary, setRainyItinerary] = useState<any>(null);

    useEffect(() => {
        // Manali (d1)
        // Solang Valley (p1_1) is Outdoor, High Sensitivity, High Crowd
        // We expect an alternative during 'Midday' if it's Hot, OR just because it's 'High Crowd'.

        const result = planningLogic.generateSmartItinerary('d1', 1, 2, [], 'Hot');
        setHotItinerary(result);

    }, []);

    return (
        <div className="p-10 space-y-10">
            <div>
                <h2 className="text-2xl font-bold mb-4">Smart Alternatives Test (Hot Weather)</h2>
                <div className="text-xs space-y-4">
                    {hotItinerary?.map((day: any) => (
                        <div key={day.day}>
                            <h3 className="font-bold text-lg">{day.title}</h3>
                            {day.activities.map((act: any) => (
                                <div key={act.title} className="p-2 border rounded my-2">
                                    <p><strong>{act.time}: {act.title}</strong></p>
                                    <p>Weather: {act.weatherStatus}</p>
                                    {act.alternative && (
                                        <p className="text-violet-600 font-bold">✨ Alternative: {act.alternative.name} ({act.alternative.reason})</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <pre className="text-xs bg-gray-100 p-4 mt-4">{JSON.stringify(hotItinerary, null, 2)}</pre>
            </div>
        </div>
    );
};

export default TestPage;
