# Digital World Clock Component

## Overview | نظرة عامة

A responsive digital clock component that displays current time for multiple selectable time zones. Built with vanilla JavaScript for easy integration into any web project.

مكون ساعة رقمية متجاوبة يعرض الوقت الحالي لعدة مناطق زمنية قابلة للاختيار. مبني بجافا سكريبت خالص للتكامل السهل مع أي مشروع ويب.

## Features | المميزات

- ✅ **Real-time Updates**: Clock updates every second | تحديث مباشر: الساعة تحديث كل ثانية
- ✅ **Multiple Time Zones**: Display 3+ time zones simultaneously | مناطق زمنية متعددة: عرض 3+ مناطق زمنية بشكل متزامن
- ✅ **Add/Remove Zones**: Users can add or remove time zones | إضافة/إزالة المناطق: المستخدمون يمكنهم إضافة أو إزالة المناطق الزمنية
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile | تصميم متجاوب: يعمل على سطح المكتب والجهاز اللوحي والهاتف المحمول
- ✅ **Bilingual Support**: Arabic and English interface | دعم ثنائي اللغة: واجهة عربية وإنجليزية
- ✅ **16 World Time Zones**: Pre-configured with major cities | 16 منطقة زمنية عالمية: معدة مسبقاً مع المدن الرئيسية
- ✅ **Modern UI**: Gradient cards with intuitive controls | واجهة حديثة: بطاقات متدرجة مع عناصر تحكم بديهية

## Supported Time Zones | المناطق الزمنية المدعومة

| City/المدينة | Time Zone/المنطقة الزمنية | Display Name/اسم العرض |
|--------------|---------------------------|------------------------|
| New York | America/New_York | نيويورك \| New York |
| Los Angeles | America/Los_Angeles | لوس أنجلوس \| Los Angeles |
| London | Europe/London | لندن \| London |
| Paris | Europe/Paris | باريس \| Paris |
| Berlin | Europe/Berlin | برلين \| Berlin |
| Tokyo | Asia/Tokyo | طوكيو \| Tokyo |
| Shanghai | Asia/Shanghai | شنغهاي \| Shanghai |
| Dubai | Asia/Dubai | دبي \| Dubai |
| Mumbai | Asia/Kolkata | مومباي \| Mumbai |
| Riyadh | Asia/Riyadh | الرياض \| Riyadh |
| Sydney | Australia/Sydney | سيدني \| Sydney |
| Auckland | Pacific/Auckland | أوكلاند \| Auckland |
| São Paulo | America/Sao_Paulo | ساو باولو \| São Paulo |
| Mexico City | America/Mexico_City | مكسيكو سيتي \| Mexico City |
| Cairo | Africa/Cairo | القاهرة \| Cairo |
| Johannesburg | Africa/Johannesburg | جوهانسبرغ \| Johannesburg |

## Usage | الاستخدام

### As a Standalone Component | كمكون مستقل

The clock is already integrated into the main `index.html` file. To use it in your own project:

الساعة مدمجة بالفعل في ملف `index.html` الرئيسي. لاستخدامها في مشروعك الخاص:

1. **Copy the HTML structure | انسخ البنية HTML:**
```html
<div class="clock-container">
    <div class="clock-header">
        <div class="clock-title">🌍 الساعة العالمية | World Clock</div>
        <div class="timezone-controls">
            <select id="timezoneSelect" class="timezone-select">
                <option value="">إضافة منطقة زمنية | Add Time Zone</option>
                <!-- Add all timezone options here -->
            </select>
            <button id="addTimezoneBtn" class="add-timezone-btn">إضافة | Add</button>
        </div>
    </div>
    <div id="timezoneGrid" class="timezone-grid">
        <!-- Time zone cards will be populated by JavaScript -->
    </div>
</div>
```

2. **Include the CSS styles | ضمّن أنماط CSS:**
Copy the entire `<style>` section from `index.html` to your CSS file or `<head>` section.

انسخ قسم `<style>` بالكامل من `index.html` إلى ملف CSS الخاص بك أو قسم `<head>`.

3. **Add the JavaScript | أضف الجافا سكريبت:**
Copy the entire `<script>` section from `index.html` to your JavaScript file or before the closing `</body>` tag.

انسخ قسم `<script>` بالكامل من `index.html` إلى ملف الجافا سكريبت الخاص بك أو قبل علامة إغلاق `</body>`.

### Integration with React | التكامل مع React

To convert this component to React:

لتحويل هذا المكون إلى React:

```jsx
import React, { useState, useEffect } from 'react';

const WorldClock = () => {
    const [timezones, setTimezones] = useState([
        { id: 'local', name: 'التوقيت المحلي | Local Time', timezone: 'local', removable: false, cssClass: 'local' },
        { id: 'utc', name: 'التوقيت العالمي | UTC', timezone: 'UTC', removable: false, cssClass: 'utc' },
        { id: 'riyadh', name: 'الرياض | Riyadh', timezone: 'Asia/Riyadh', removable: true, cssClass: '' }
    ]);
    
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Add your component logic here
    // أضف منطق المكون هنا
    
    return (
        <div className="clock-container">
            {/* Component JSX */}
        </div>
    );
};

export default WorldClock;
```

### Integration with Vue.js | التكامل مع Vue.js

To convert this component to Vue.js:

لتحويل هذا المكون إلى Vue.js:

```vue
<template>
    <div class="clock-container">
        <!-- Component template -->
    </div>
</template>

<script>
export default {
    name: 'WorldClock',
    data() {
        return {
            timezones: [
                { id: 'local', name: 'التوقيت المحلي | Local Time', timezone: 'local', removable: false, cssClass: 'local' },
                { id: 'utc', name: 'التوقيت العالمي | UTC', timezone: 'UTC', removable: false, cssClass: 'utc' },
                { id: 'riyadh', name: 'الرياض | Riyadh', timezone: 'Asia/Riyadh', removable: true, cssClass: '' }
            ],
            currentTime: new Date(),
            updateInterval: null
        }
    },
    mounted() {
        this.startClock();
    },
    beforeDestroy() {
        this.stopClock();
    },
    methods: {
        // Add your component methods here
        // أضف طرق المكون هنا
    }
}
</script>
```

## API Reference | مرجع API

### WorldClock Class | فئة WorldClock

#### Methods | الطرق

- `init()` - Initialize the component | تهيئة المكون
- `startClock()` - Start time updates | بدء تحديثات الوقت
- `stopClock()` - Stop time updates | إيقاف تحديثات الوقت
- `addTimezone(timezoneValue)` - Add new timezone | إضافة منطقة زمنية جديدة
- `removeTimezone(timezoneId)` - Remove timezone | إزالة منطقة زمنية
- `formatTime(date, timezone)` - Format time for display | تنسيق الوقت للعرض
- `renderTimezones()` - Re-render all timezone cards | إعادة عرض جميع بطاقات المناطق الزمنية

#### Properties | الخصائص

- `timezones` - Array of timezone objects | مصفوفة كائنات المناطق الزمنية
- `updateInterval` - Interval ID for updates | معرف الفاصل الزمني للتحديثات

## Customization | التخصيص

### Adding New Time Zones | إضافة مناطق زمنية جديدة

To add more time zones to the dropdown:

لإضافة المزيد من المناطق الزمنية إلى القائمة المنسدلة:

1. Add new `<option>` elements to the select dropdown
2. Update the `getTimezoneDisplayName()` method with the new timezone name
3. Ensure the timezone identifier is valid (IANA Time Zone Database)

### Styling Customization | تخصيص التصميم

The component uses CSS custom properties that can be overridden:

المكون يستخدم خصائص CSS مخصصة يمكن تجاوزها:

```css
.timezone-card {
    /* Customize card background */
    background: your-gradient-here;
}

.timezone-card.local {
    /* Customize local time card */
    background: your-local-gradient;
}

.timezone-card.utc {
    /* Customize UTC card */
    background: your-utc-gradient;
}
```

## Performance Considerations | اعتبارات الأداء

- Updates pause when page is hidden (using Page Visibility API) | التحديثات تتوقف عندما تكون الصفحة مخفية
- Efficient DOM updates (only time elements are updated) | تحديثات DOM فعالة (فقط عناصر الوقت يتم تحديثها)
- Memory cleanup on page unload | تنظيف الذاكرة عند إلغاء تحميل الصفحة

## Browser Compatibility | توافق المتصفح

- ✅ Chrome 60+ | كروم 60+
- ✅ Firefox 55+ | فايرفوكس 55+
- ✅ Safari 11+ | سفاري 11+
- ✅ Edge 79+ | إدج 79+

## Dependencies | التبعيات

**None!** Pure vanilla JavaScript with no external dependencies.

**لا يوجد!** جافا سكريبت خالص بدون تبعيات خارجية.

## File Structure | هيكل الملفات

```
/
├── index.html              # Main page with integrated clock
├── DIGITAL_CLOCK_README.md # This documentation file
├── .gitignore             # Git ignore rules
└── other project files...
```

## Testing | الاختبار

To test the component locally:

لاختبار المكون محلياً:

1. Start a local web server | ابدأ خادم ويب محلي:
```bash
python3 -m http.server 8000
# or
npx serve .
```

2. Open `http://localhost:8000` in your browser | افتح `http://localhost:8000` في متصفحك

3. Test functionality | اختبر الوظائف:
   - Verify clocks update every second | تحقق من تحديث الساعات كل ثانية
   - Add new timezones from dropdown | أضف مناطق زمنية جديدة من القائمة المنسدلة
   - Remove timezones using × button | أزل المناطق الزمنية باستخدام زر ×
   - Test responsive design on different screen sizes | اختبر التصميم المتجاوب على أحجام شاشة مختلفة

## License | الترخيص

This component is part of the WASL project and follows the same license terms.

هذا المكون جزء من مشروع وسل ويتبع نفس شروط الترخيص.

## Support | الدعم

For questions or issues, please refer to the main project documentation or create an issue in the repository.

للأسئلة أو المشاكل، يرجى الرجوع إلى وثائق المشروع الرئيسية أو إنشاء مشكلة في المستودع.