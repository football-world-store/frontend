import { CAMPAIGN } from "@/constants";

export const AnnouncementBar = () => {
  if (!CAMPAIGN.showAnnouncementBar) return null;

  return (
    <div className="bg-primary text-on-primary text-center py-2 px-4">
      <p className="font-label text-xs sm:text-sm uppercase tracking-wide font-medium">
        {CAMPAIGN.announcementText}
      </p>
    </div>
  );
};
