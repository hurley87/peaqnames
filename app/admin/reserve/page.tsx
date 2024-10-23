import { Separator } from '@/components/ui/separator';
import { ReserveForm } from './reserve-form';

export default function ReservePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Reserve Name</h3>
        <p className="text-sm text-muted-foreground">
          Mint a name for someone else.
        </p>
      </div>
      <Separator />
      <ReserveForm />
    </div>
  );
}
