import { FormMockInterview } from "@/components/MockInterview/form-mock-interview";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ApiClient } from "@/config/api";
import { toast } from "sonner";
const CreateEditPage = () => {
    const { interviewId } = useParams();
    const [interview, setInterview] = useState(null);
    const { getToken } = useAuth();
    useEffect(() => {
        const fetchInterview = async () => {
            if (interviewId && interviewId !== 'create') {
                try {
                    const token = getToken();
                    if (!token) {
                        toast.error("Authentication token not found");
                        return;
                    }
                    const resp = await ApiClient.getInterviewById(interviewId, token);
                    if (!resp.success || !resp.data) {
                        throw new Error(resp.error || 'Failed to fetch interview');
                    }
                    const item = resp.data;
                    setInterview({
                        id: item._id ?? item.id,
                        position: item.position,
                        description: item.description,
                        experience: item.experience,
                        userId: item.userId,
                        techStack: item.techStack,
                        questions: item.questions || [],
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    });
                }
                catch (error) {
                    console.log(error);
                    toast.error("Failed to load interview");
                }
            }
        };
        fetchInterview();
    }, [interviewId, getToken]);
    return (<div className="my-4 flex-col w-full">
      <FormMockInterview initialData={interview}/>
    </div>);
};
export default CreateEditPage;
