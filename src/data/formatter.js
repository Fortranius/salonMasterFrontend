export function typeMasterFormatter(cell) {
    switch (cell) {
        case 'TOP_LEADER':
            return "Руководитель Топ мастер";
        case 'TOP':
            return "Топ мастер";
        case 'MIDDLE_PLUS':
            return "Стандарт плюс мастер";
        case 'MIDDLE':
            return "Стандартный мастер";
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

export function typeHairFormatter(cell) {
    switch (cell) {
        case 'HAIR_EXTENSION':
            return "Наращивание волос";
        case 'HAIR_REMOVAL':
            return "Снятие волос";
        default:
            return "";
    }
}

export function typeMAsterWorkingDayFormatter(cell) {
    switch (cell) {
        case '$2X2':
            return "2 на 2";
        case '$5X2':
            return "5 на 2";
        case '$4X2':
            return "4 на 2";
        default:
            return "";
    }
}
