export interface Event {
  id: string;
  activity_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  max_participants: number | null;
  price: number | null;
  created_at: string;
  created_by: string | null;
}