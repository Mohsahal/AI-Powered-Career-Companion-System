import { Headings } from "@/components/MockInterview/Headings";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/config/api";
import { Card } from "@/components/ui/card";
const QuestionsPage = () => {
    const { getToken } = useAuth();
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const token = getToken();
                if (!token)
                    return;
                const resp = await ApiClient.getInterviews(token);
                if (resp.success && resp.data)
                    setInterviews(resp.data);
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [getToken]);
    return (<div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Headings title="Question Bank" description="Browse all generated interview questions from your mock interviews."/>

        <div className="space-y-6">
          {loading && <p className="text-sm text-muted-foreground">Loading questions…</p>}
          {!loading && interviews.length === 0 && (<p className="text-sm text-muted-foreground">No interviews yet. Create one to generate questions.</p>)}

          {interviews.map((iv) => (<Card key={iv.id} className="p-4">
              <h3 className="font-semibold text-gray-900">{iv.position}</h3>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                {iv.questions?.map((q, i) => (<li key={i} className="text-sm text-gray-700">
                    {q.question}
                  </li>))}
                {(!iv.questions || iv.questions.length === 0) && (<li className="text-sm text-muted-foreground">No questions generated for this interview.</li>)}
              </ul>
            </Card>))}
        </div>
      </div>
    </div>);
};
export default QuestionsPage;
