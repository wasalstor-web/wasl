#!/bin/bash

# Domain Setup Verification Script
# سكريبت التحقق من إعداد النطاق

echo "🔍 التحقق من إعداد النطاق wasl.store..."
echo "🔍 Verifying wasl.store domain setup..."
echo "=================================================="

DOMAIN="wasl.store"
EXPECTED_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")

# Check A records
echo "📋 فحص سجلات A:"
echo "📋 Checking A records:"
for ip in "${EXPECTED_IPS[@]}"; do
    if nslookup $DOMAIN | grep -q $ip; then
        echo "✅ سجل A موجود: $ip"
        echo "✅ A record found: $ip"
    else
        echo "❌ سجل A مفقود: $ip"
        echo "❌ A record missing: $ip"
    fi
done

echo ""

# Check CNAME for www
echo "🌐 فحص سجل CNAME للـ www:"
echo "🌐 Checking CNAME record for www:"
if nslookup www.$DOMAIN | grep -q "wasalstor-web.github.io"; then
    echo "✅ سجل CNAME صحيح للـ www"
    echo "✅ CNAME record correct for www"
else
    echo "❌ سجل CNAME مفقود أو غير صحيح للـ www"
    echo "❌ CNAME record missing or incorrect for www"
fi

echo ""

# Check HTTPS availability
echo "🔒 فحص توفر HTTPS:"
echo "🔒 Checking HTTPS availability:"
if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    echo "✅ HTTPS يعمل بشكل صحيح"
    echo "✅ HTTPS working correctly"
else
    echo "❌ HTTPS غير متوفر أو يواجه مشاكل"
    echo "❌ HTTPS not available or having issues"
fi

echo ""

# Check redirect from www
echo "🔄 فحص التوجيه من www:"
echo "🔄 Checking redirect from www:"
if curl -s -I https://www.$DOMAIN | grep -q "301\|302"; then
    echo "✅ التوجيه من www يعمل"
    echo "✅ www redirect working"
else
    echo "⚠️  التوجيه من www قد لا يعمل"
    echo "⚠️  www redirect may not be working"
fi

echo ""
echo "=================================================="
echo "✨ انتهى فحص النطاق"
echo "✨ Domain verification completed"

# Instructions
echo ""
echo "📝 إذا كان هناك أخطاء:"
echo "📝 If there are errors:"
echo "1. تحقق من إعدادات DNS لديك"
echo "1. Check your DNS settings"
echo "2. انتظر حتى 24-48 ساعة للانتشار"
echo "2. Wait up to 24-48 hours for propagation"
echo "3. راجع ملف DOMAIN_SETUP.md للمزيد من التفاصيل"
echo "3. Check DOMAIN_SETUP.md for more details"