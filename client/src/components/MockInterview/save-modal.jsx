import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
export const SaveModal = ({ isOpen, onClose, onConfirm, loading }) => {
    return (<AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Your Answer</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save this answer? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading} className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
            Save Answer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);
};
