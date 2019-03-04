export default function typeFormatter(cell) {
    switch (cell) {
        case 'HAIR_EXTENSION':
            return "Наращивание волос";
        case 'HAIR_REMOVAL':
            return "Снятие волос";
        default:
            return "";
    }
}

