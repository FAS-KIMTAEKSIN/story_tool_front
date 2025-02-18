import React from "react";
import { BiMessageSquareDetail } from "react-icons/bi";

const HistoryList = ({ historyList, onItemClick }) => {
  const today = new Date();
  const groups = {};

  historyList.forEach(chat => {
    // 우선 thread_created_at가 있으면 사용하고, 없으면 thread_updated_at 사용
    const createdDate = new Date(
      chat.thread_created_at || chat.thread_updated_at
    );
    const diffTime = today - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    let groupKey = "";
    if (today.toDateString() === createdDate.toDateString()) {
      groupKey = "오늘";
    } else if (diffDays < 7) {
      groupKey = "지난 7일";
    } else if (diffDays < 30) {
      groupKey = "지난 30일";
    } else if (today.getFullYear() === createdDate.getFullYear()) {
      groupKey = createdDate.getMonth() + 1 + "월";
    } else {
      groupKey = createdDate.getFullYear().toString();
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(chat);
  });

  // ── 그룹 순서 정리 ──
  const sortedGroups = [];
  if (groups["오늘"]) sortedGroups.push({ key: "오늘", items: groups["오늘"] });
  if (groups["지난 7일"])
    sortedGroups.push({ key: "지난 7일", items: groups["지난 7일"] });
  if (groups["지난 30일"])
    sortedGroups.push({ key: "지난 30일", items: groups["지난 30일"] });

  const monthKeys = Object.keys(groups)
    .filter(key => key.endsWith("월"))
    .sort((a, b) => parseInt(b) - parseInt(a));
  monthKeys.forEach(key => {
    sortedGroups.push({ key, items: groups[key] });
  });

  const yearKeys = Object.keys(groups)
    .filter(key => /^\d{4}$/.test(key))
    .sort((a, b) => parseInt(b) - parseInt(a));
  yearKeys.forEach(key => {
    sortedGroups.push({ key, items: groups[key] });
  });

  return historyList.length > 0
    ? <div className="mt-4 ml-3 flex-grow overflow-y-auto">
        {sortedGroups.map(group =>
          <React.Fragment key={group.key}>
            <div className="px-4 py-2 text-gray-500 text-xs">
              {group.key}
            </div>
            {group.items.map((chat, index) =>
              <div
                key={chat.thread_id || index}
                className="cursor-pointer hover:bg-gray-100 p-3 flex items-center gap-2"
                onClick={
                  onItemClick ? () => onItemClick(chat.thread_id) : undefined
                }
              >
                <BiMessageSquareDetail className="text-base text-gray-600" />
                <span className="text-sm">
                  {chat.title || "제목 없음"}
                </span>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    : <p className="text-center text-gray-500 mt-4">히스토리가 없습니다.</p>;
};

export default HistoryList;
