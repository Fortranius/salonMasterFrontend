export function reportOptions() {
    return [
        { value: 0, label: 'Отчет по мастерам' },
        { value: 1, label: 'Отчет по прибыли' }
    ];
}

export function hourOptions() {
    return [
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
        { value: 13, label: '13' },
        { value: 14, label: '14' },
        { value: 15, label: '15' },
        { value: 16, label: '16' },
        { value: 17, label: '17' },
        { value: 18, label: '18' },
        { value: 19, label: '19' },
        { value: 20, label: '20' },
        { value: 21, label: '21' },
        { value: 22, label: '22' }
    ];
}

export function minuteOptions() {
    return [
        { value: 0, label: '00' },
        { value: 5, label: '05' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' },
        { value: 25, label: '25' },
        { value: 30, label: '30' },
        { value: 35, label: '35' },
        { value: 40, label: '40' },
        { value: 45, label: '45' },
        { value: 50, label: '50' },
        { value: 55, label: '55' }
    ];
}

export function masterTypeOptions() {
    return [
        { value: 'TOP_LEADER', label: 'Руководитель Топ мастер' },
        { value: 'TOP', label: 'Топ мастер' },
        { value: 'MIDDLE_PLUS', label: 'Стандарт плюс мастер' },
        { value: 'MIDDLE', label: 'Стандартный мастер' },
        { value: 'START', label: 'Начинающий мастер' },
        { value: 'SUPPORT', label: 'Помощник' },
        { value: 'TOP_COLORIST', label: 'Топ колорист' },
        { value: 'COLORIST', label: 'Колорист' },
        { value: 'CARE_MASTER', label: 'Мастер по уходовым процедурам' }
    ];
}

export function masterWorkOptions() {
    return [
        { value: '$2X2', label: '2 на 2' },
        { value: '$4X2', label: '4 на 2' },
        { value: '$5X2', label: '5 на 2' }
    ];
}