import { Separator } from '@/components/ui/separator';
import { WithdrawForm } from './withdraw-form';

export default function WithdrawPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Withdraw Funds</h3>
        <p className="text-sm text-muted-foreground">
          Funds go here: 0x1169E27981BceEd47E590bB9E327b26529962bAe
        </p>
      </div>
      <Separator />
      <WithdrawForm />
    </div>
  );
}
