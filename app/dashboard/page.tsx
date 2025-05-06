import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Permanently redirect to the /dashboard/new page
  redirect('/dashboard/new');

  // Note: Nothing below the redirect() call will be executed or rendered.
  // You can optionally return null or an empty fragment, but it's not strictly necessary.
  // return null;
}
