#!/bin/bash

# Domain Setup Verification Script
# سكريبت التحقق من إعداد النطاق

echo "🔍 التحقق من إعداد النطاق wasl.store..."
echo "🔍 Verifying wasl.store domain setup..."
echo "=================================================="
echo ""
echo "📋 سيتم فحص:"
echo "📋 Will check:"
echo "• سجلات A للنطاق الرئيسي (4 عناوين IP)"
echo "• A records for root domain (4 IP addresses)"
echo "• سجل CNAME للـ www"  
echo "• CNAME record for www subdomain"
echo "• توفر HTTPS"
echo "• HTTPS availability"
echo "• التوجيه من www إلى النطاق الرئيسي"
echo "• Redirect from www to root domain"
echo ""
echo "=================================================="

DOMAIN="wasl.store"
EXPECTED_IPS=("185.199.108.153" "185.199.109.153" "185.199.110.153" "185.199.111.153")

# Check A records
echo "📋 فحص سجلات A:"
echo "📋 Checking A records:"
MISSING_A_RECORDS=()
for ip in "${EXPECTED_IPS[@]}"; do
    if nslookup $DOMAIN | grep -q $ip; then
        echo "✅ سجل A موجود: $ip"
        echo "✅ A record found: $ip"
    else
        echo "❌ سجل A مفقود: $ip"
        echo "❌ A record missing: $ip"
        MISSING_A_RECORDS+=("$ip")
    fi
done

# Show current DNS resolution
echo ""
echo "🔍 الحالة الحالية لـ DNS:"
echo "🔍 Current DNS resolution:"
nslookup $DOMAIN || echo "⚠️  فشل في الاستعلام عن DNS - Domain DNS query failed"

echo ""

# Check CNAME for www
echo "🌐 فحص سجل CNAME للـ www:"
echo "🌐 Checking CNAME record for www:"
WWW_LOOKUP=$(nslookup www.$DOMAIN 2>&1)
if echo "$WWW_LOOKUP" | grep -q "wasalstor-web.github.io"; then
    echo "✅ سجل CNAME صحيح للـ www"
    echo "✅ CNAME record correct for www"
else
    echo "❌ سجل CNAME مفقود أو غير صحيح للـ www"
    echo "❌ CNAME record missing or incorrect for www"
    echo "🔍 الحالة الحالية لـ www:"
    echo "🔍 Current www resolution:"
    echo "$WWW_LOOKUP" | head -10
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

if [ ${#MISSING_A_RECORDS[@]} -gt 0 ]; then
    echo ""
    echo "🔧 إصلاح سجلات A المفقودة:"
    echo "🔧 Fix missing A records:"
    echo "أضف السجلات التالية إلى إعدادات DNS الخاصة بك:"
    echo "Add the following records to your DNS settings:"
    for ip in "${MISSING_A_RECORDS[@]}"; do
        echo "   Type: A, Name: @, Value: $ip, TTL: 300"
    done
fi

echo ""
echo "1. تحقق من إعدادات DNS لديك"
echo "1. Check your DNS settings"
echo "2. انتظر حتى 24-48 ساعة للانتشار"
echo "2. Wait up to 24-48 hours for propagation"
echo "3. راجع ملف DOMAIN_SETUP.md للمزيد من التفاصيل"
echo "3. Check DOMAIN_SETUP.md for more details"

echo ""
echo "🛠️  أدوات مفيدة للتحقق من DNS:"
echo "🛠️  Useful DNS checking tools:"
echo "• https://dnschecker.org/"
echo "• https://www.whatsmydns.net/"
echo "• nslookup $DOMAIN"
echo "• dig $DOMAIN A"