# Google AI Integration Configuration
# إعدادات دمج الذكاء الاصطناعي من جوجل

## API Keys Configuration
# مفاتيح واجهة برمجة التطبيقات

### Google Maps API
- Enable the following APIs in Google Cloud Console:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Directions API
  - Distance Matrix API

### Google AI (Gemini) API
- Enable Generative AI API
- Configure API quotas and usage limits
- Set up authentication

### Google Translate API
- Enable Cloud Translation API
- Configure supported languages

### Google Analytics
- Set up GA4 property
- Configure enhanced ecommerce tracking

## Configuration Steps
# خطوات الإعداد

### 1. Google Cloud Console Setup
```
1. إنشاء مشروع جديد في Google Cloud Console
2. تفعيل الـ APIs المطلوبة
3. إنشاء مفاتيح API
4. تكوين القيود والحدود
```

### 2. Update HTML file
```javascript
// Replace YOUR_API_KEY with actual keys
const GOOGLE_MAPS_API_KEY = 'your_actual_maps_api_key';
const GOOGLE_AI_API_KEY = 'your_actual_ai_api_key';
const GA_MEASUREMENT_ID = 'your_actual_ga_id';
```

### 3. OAuth Setup
```javascript
// Replace with your OAuth client ID
const GOOGLE_CLIENT_ID = 'your_client_id.apps.googleusercontent.com';
```

## Security Best Practices
# أفضل الممارسات الأمنية

1. **API Key Restrictions**
   - Restrict by HTTP referrer (wasl.store/*)
   - Restrict by API (only needed APIs)
   - Monitor usage regularly

2. **OAuth Configuration**
   - Add authorized domains: wasl.store
   - Set up proper scopes
   - Configure consent screen

3. **Rate Limiting**
   - Implement client-side rate limiting
   - Monitor quota usage
   - Set up alerts for high usage

## Features Enabled
# المميزات المفعلة

### 🗺️ Google Maps Integration
- Interactive maps with delivery locations
- Real-time location tracking
- Route optimization
- Traffic analysis

### 🤖 Google AI (Gemini) Features
- Intelligent query processing
- Content summarization
- Smart suggestions
- Natural language understanding

### 🔐 Google OAuth
- Secure user authentication
- Profile integration
- Personalized experience

### 🌍 Google Translate
- Multi-language support
- Real-time translation
- Arabic-first interface

### 📊 Google Analytics
- User behavior tracking
- Performance monitoring
- Feature usage analytics

## Environment Variables
# متغيرات البيئة

For production deployment, consider using environment variables:

```bash
GOOGLE_MAPS_API_KEY=your_maps_key
GOOGLE_AI_API_KEY=your_ai_key
GOOGLE_OAUTH_CLIENT_ID=your_oauth_id
GA_MEASUREMENT_ID=your_ga_id
```

## Testing Checklist
# قائمة الاختبار

- [ ] Maps load correctly with markers
- [ ] OAuth login/logout works
- [ ] AI responses are generated
- [ ] Translation widget functions
- [ ] Analytics events are tracked
- [ ] Extension popup works
- [ ] Context menus appear
- [ ] Keyboard shortcuts respond

## Troubleshooting
# استكشاف الأخطاء

### Common Issues:
1. **Maps not loading**: Check API key and quotas
2. **OAuth not working**: Verify domain authorization
3. **AI not responding**: Check API key and billing
4. **Translation not working**: Verify Translate API is enabled

### Debug Commands:
```javascript
// Check if Google APIs are loaded
console.log('Google Maps:', typeof google !== 'undefined' && google.maps);
console.log('Google Auth:', typeof google !== 'undefined' && google.accounts);

// Check extension status
chrome.storage.sync.get(null, console.log);
```

## Performance Optimization
# تحسين الأداء

1. **Lazy Loading**: Load APIs only when needed
2. **Caching**: Cache API responses where appropriate
3. **Compression**: Minimize payload sizes
4. **CDN**: Use Google's CDN for libraries

## Compliance Notes
# ملاحظات الامتثال

- Ensure GDPR compliance for EU users
- Follow Google's API Terms of Service
- Implement proper data retention policies
- Provide clear privacy notices

## Support & Documentation
# الدعم والتوثيق

- [Google Maps API Documentation](https://developers.google.com/maps/documentation)
- [Google AI API Documentation](https://ai.google.dev/docs)
- [Google Identity Documentation](https://developers.google.com/identity)
- [Google Analytics Documentation](https://developers.google.com/analytics)