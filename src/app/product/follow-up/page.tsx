import type { Metadata } from 'next';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductFeatures, { type ProductPoint } from '@/components/ProductFeatures';
import ProductHero from '@/components/ProductHero';

export const metadata: Metadata = {
  title: 'Follow-up',
  description:
    'Follow-up tasks with due dates and priority, linked to each convert, and a calendar with repeating events and reminders for meetings, prayer and discipleship classes.',
};

const POINTS: ProductPoint[] = [
  {
    icon: 'task_alt',
    title: 'Follow-up tasks',
    body: 'Create a task for each next step, give it a due date and a priority, and link it to the convert it is for.',
  },
  {
    icon: 'view_kanban',
    title: 'Tasks by status at a glance',
    body: 'See every task grouped by status, so it is clear what is still to do, what is under way and what is done.',
  },
  {
    icon: 'event_repeat',
    title: 'Repeating events',
    body: 'Plan follow-up meetings, prayer and discipleship classes on one calendar, as one-off events or repeating daily, weekly or monthly.',
  },
  {
    icon: 'notifications',
    title: 'Reminders',
    body: 'Set reminders for follow-up meetings, prayer and discipleship classes, so nothing on the calendar is missed.',
  },
];

const TASKS = [
  { title: 'Call Grace M.', due: 'Due Tuesday', priority: 'High' },
  { title: 'Visit Daniel K.', due: 'Due Thursday', priority: 'Medium' },
];

const EVENTS = [
  { icon: 'event_repeat', title: 'Morning prayer', detail: 'Repeats daily' },
  { icon: 'event_repeat', title: 'Discipleship class', detail: 'Repeats weekly' },
  { icon: 'notifications', title: 'Follow-up meeting with Grace M.', detail: 'Reminder set' },
];

/** The hero picture: a few follow-up tasks, and the week's calendar with repeating events and a reminder. */
function FollowUpVisual() {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background-light p-4 sm:p-6">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 font-bold text-text">
          <span className="material-symbols-outlined text-xl text-primary">task_alt</span>
          Follow-up tasks
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {TASKS.map((task) => (
            <li
              key={task.title}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
            >
              <span>
                <span className="block font-semibold text-text">{task.title}</span>
                <span className="text-muted">{task.due}</span>
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="flex items-center gap-2 font-bold text-text">
          <span className="material-symbols-outlined text-xl text-primary">calendar_month</span>
          This week
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {EVENTS.map((event) => (
            <li key={event.title} className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg text-primary">{event.icon}</span>
              <span className="flex-1 text-text">{event.title}</span>
              <span className="text-muted">{event.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FollowUpPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ProductHero
          parent={{ label: 'Product', href: '/#features' }}
          name="Follow-up"
          title="Every next step, assigned and on the calendar."
          subtitle="Turn each convert's next step into a task with a due date and priority, and keep meetings, prayer and discipleship classes on one calendar with reminders."
          visual={<FollowUpVisual />}
          visualLabel="Follow-up in injily: two tasks, calling Grace M. (high priority, due Tuesday) and visiting Daniel K. (medium priority, due Thursday), and the week's calendar with morning prayer repeating daily, a discipleship class repeating weekly and a follow-up meeting with a reminder set."
        />
        <ProductFeatures
          title="Follow-up that actually happens"
          subtitle="Tasks and a calendar built around the people you're discipling."
          points={POINTS}
        />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
