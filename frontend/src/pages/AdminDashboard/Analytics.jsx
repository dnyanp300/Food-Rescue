import React, { useState } from 'react';
import { adminApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Analytics({ initialStats }) {
    const [aiStats, setAiStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const runAiAnalytics = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getAiAnalytics();
            setAiStats(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Food Redistributed</p>
              <p className="text-3xl font-bold">{initialStats.total_food_redistributed}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Top Donor Location</p>
              <p className="text-xl font-bold">{initialStats.top_donor_locations[0]?.location || 'N/A'}</p>
          </div>
        </div>

        <div>
          <Button
              onClick={runAiAnalytics}
              disabled={loading}
          >
              {loading ? 'Running AI Analysis...' : 'Get Gemini AI Insights'}
          </Button>

          {aiStats && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-800">AI-Powered Insight:</h4>
                  <p className="text-blue-700">{aiStats.insight}</p>
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}