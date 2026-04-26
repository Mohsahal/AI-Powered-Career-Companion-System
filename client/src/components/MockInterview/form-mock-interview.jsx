import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { CustomBreadCrumb } from "./Custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Headings } from "@/components/MockInterview/Headings";
import { Button } from "@/components/ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApiClient, API_ENDPOINTS } from "@/config/api";
const formSchema = z.object({
    position: z
        .string()
        .min(1, "Position is required")
        .max(100, "Position must be 100 characters or less"),
    description: z.string().min(10, "Description is required"),
    experience: z.coerce
        .number()
        .min(0, "Experience cannot be empty or negative"),
    techStack: z.string().min(1, "Tech stack must be at least a character"),
});
export const FormMockInterview = ({ initialData }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {},
    });
    const { isValid, isSubmitting } = form.formState;
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getToken, user } = useAuth();
    const title = initialData
        ? initialData.position
        : "Create a new mock interview";
    const breadCrumpPage = initialData ? initialData?.position : "Create";
    const actions = initialData ? "Save Changes" : "Create";
    const toastMessage = initialData
        ? { title: "Updated..!", description: "Changes saved successfully..." }
        : { title: "Created..!", description: "New Mock Interview created..." };
    const cleanAiResponse = (responseText) => {
        // Step 1: Trim any surrounding whitespace
        let cleanText = responseText.trim();
        // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
        cleanText = cleanText.replace(/(json|```|`)/g, "");
        // Step 3: Extract a JSON array by capturing text between square brackets
        const jsonArrayMatch = cleanText.match(/\[.*\]/s);
        if (jsonArrayMatch) {
            cleanText = jsonArrayMatch[0];
        }
        else {
            throw new Error("No JSON array found in response");
        }
        // Step 4: Parse the clean JSON text into an array of objects
        try {
            return JSON.parse(cleanText);
        }
        catch (error) {
            throw new Error("Invalid JSON format: " + error?.message);
        }
    };
    const generateAiResponse = async (data) => {
        const res = await fetch(API_ENDPOINTS.QUESTIONS.GENERATE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                position: data.position,
                description: data.description,
                experience: data.experience,
                techStack: data.techStack,
            }),
        });
        if (!res.ok)
            throw new Error("Failed to generate questions");
        const json = await res.json();
        return json.questions ?? [];
    };
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (initialData) {
                // update
                if (isValid) {
                    const aiResult = await generateAiResponse(data);
                    const token = getToken();
                    if (!token) {
                        toast.error('Please login to create mock interviews');
                        navigate('/login');
                        return;
                    }
                    const interviewData = {
                        position: data.position,
                        description: data.description,
                        experience: data.experience,
                        techStack: data.techStack,
                        userId: user?.id || '',
                        questions: aiResult
                    };
                    const resp = await ApiClient.updateInterview(initialData.id, interviewData);
                    toast(toastMessage.title, { description: toastMessage.description });
                }
            }
            else {
                // create a new mock interview
                if (isValid) {
                    const aiResult = await generateAiResponse(data);
                    const token = getToken();
                    if (!token) {
                        toast.error('Please login to create mock interviews');
                        navigate('/login');
                        return;
                    }
                    const interviewData = {
                        position: data.position,
                        description: data.description,
                        experience: data.experience,
                        techStack: data.techStack,
                        userId: user?.id || '',
                        questions: aiResult
                    };
                    const resp = await ApiClient.createInterview(interviewData);
                    toast(toastMessage.title, { description: toastMessage.description });
                }
            }
            navigate("/generate");
        }
        catch (error) {
            console.log(error);
            toast.error("Error..", {
                description: `Something went wrong. Please try again later`,
            });
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (initialData) {
            form.reset({
                position: initialData.position,
                description: initialData.description,
                experience: initialData.experience,
                techStack: initialData.techStack,
            });
        }
    }, [initialData, form]);
    return (<>
    {/* <div className="mx-5">
    
        <Header/>
        </div> */}
    <div className="w-full flex-col space-y-4 p-9">
      
      <CustomBreadCrumb breadCrumbPage={breadCrumpPage} breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}/>

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading/>

        {initialData && (<Button size={"icon"} variant={"ghost"} onClick={async () => {
                try {
                    const token = getToken();
                    if (!token)
                        throw new Error('No auth token');
                    await ApiClient.deleteInterview(initialData.id);
                    toast("Deleted..!", { description: "Interview deleted successfully" });
                    navigate("/generate");
                }
                catch (e) {
                    toast.error("Error..", { description: "Failed to delete interview" });
                }
            }}>
            <Trash2 className="min-w-4 min-h-4 text-red-500"/>
          </Button>)}
      </div>

      <Separator className="my-4"/>

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md ">
          <FormField control={form.control} name="position" render={({ field }) => (<FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm"/>
                </div>
                <FormControl>
                  <Input className="h-12" disabled={loading} placeholder="eg:- Full Stack Developer" {...field} value={field.value || ""}/>
                </FormControl>
              </FormItem>)}/>

          <FormField control={form.control} name="description" render={({ field }) => (<FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm"/>
                </div>
                <FormControl>
                  <Textarea className="h-12" disabled={loading} placeholder="eg:- describle your job role" {...field} value={field.value || ""}/>
                </FormControl>
              </FormItem>)}/>

          <FormField control={form.control} name="experience" render={({ field }) => (<FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm"/>
                </div>
                <FormControl>
                  <Input type="number" className="h-12" disabled={loading} placeholder="eg:- 5 Years" {...field} value={field.value || ""}/>
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  💡 Enter 0 for fresher-level questions (basic concepts and fundamentals only)
                </p>
              </FormItem>)}/>

          <FormField control={form.control} name="techStack" render={({ field }) => (<FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm"/>
                </div>
                <FormControl>
                  <Textarea className="h-12" disabled={loading} placeholder="eg:- React, Typescript..." {...field} value={field.value || ""}/>
                </FormControl>
              </FormItem>)}/>

          <div className="w-full flex items-center justify-end gap-6">
            <Button type="reset" size={"sm"} variant={"outline"} disabled={isSubmitting || loading}>
              Reset
            </Button>
            <Button type="submit" size={"sm"} disabled={isSubmitting || !isValid || loading}>
              {loading ? (<Loader className="text-gray-50 animate-spin"/>) : (actions)}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
              </>);
};
