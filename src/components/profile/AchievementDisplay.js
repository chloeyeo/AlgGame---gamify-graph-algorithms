import { ACHIEVEMENT_DEFINITIONS } from "@/constants/achievements";

const AchievementBadge = ({ achievement, earned = false }) => {
  const definition = ACHIEVEMENT_DEFINITIONS[achievement.type];

  return (
    <div
      className={`p-4 rounded-lg border ${
        earned ? "bg-white" : "bg-gray-100 opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`text-3xl ${earned ? definition.color : "text-gray-800"}`}
        >
          {definition.icon}
        </span>
        <div>
          <h4
            className={`font-medium ${earned ? "text-black" : "text-gray-800"}`}
          >
            {definition.title}
          </h4>
          <p className="text-sm text-gray-800">{definition.description}</p>
          {earned && (
            <p className="text-xs text-gray-800 mt-1">
              Earned {new Date(achievement.earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementDisplay = ({ earnedAchievements = [] }) => {
  // Get all possible achievements
  const allAchievements = Object.keys(ACHIEVEMENT_DEFINITIONS).map((type) => ({
    type,
    algorithm: null,
    earnedAt: null,
  }));

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Achievements</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {allAchievements.map((achievement) => {
          const earned = earnedAchievements.find(
            (a) => a.type === achievement.type
          );
          return (
            <AchievementBadge
              key={achievement.type}
              achievement={earned || achievement}
              earned={!!earned}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AchievementDisplay;
