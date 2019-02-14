import React from "react";

export default function typeFormatter(cell) {
    switch (cell) {
        case 'TOP_LEADER':
            return "Руководитель Топ мастер";
        case 'TOP':
            return "Топ мастер";
        case 'MIDDLE_PLUS':
            return "Стандарт плюс мастер";
        case 'MIDDLE':
            return "Стандартный масте";
        case 'START':
            return "Начинающий мастер";
        case 'SUPPORT':
            return "Помощник";
        case 'TOP_COLORIST':
            return "Топ колорист";
        case 'COLORIST':
            return "Колорист";
        case 'CARE_MASTER':
            return "Мастер по уходовым процедурам";
        default:
            return "";
    }
}

