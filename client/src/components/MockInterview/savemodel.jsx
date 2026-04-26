import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
export const SaveModal = ({ isOpen, onClose, onConfirm, loading, }) => {
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Save Your Answer?
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            This will save your answer and AI feedback to your profile. You can review it later, but you won't be able to edit this specific response again.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex items-center gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="px-6">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 px-6">
            {loading ? (<div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>) : ("Save Answer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
};
