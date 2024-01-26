import { MentorTopics } from "@/types/types";

export default function FormattedTopicsAsList() {
    return Object.keys(MentorTopics).map(key =>
        key.replace(/_/g, ' ')
      );
}